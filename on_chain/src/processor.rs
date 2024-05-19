use crate::error::AppError;
use crate::helper::{oracle::Oracle};
use crate::instruction::AppInstruction;
use crate::interfaces::{xsplata::XSPLATA, xsplt::XSPLT};
use crate::schema::{
    mint::Mint,
    pool::{Pool, PoolState, MAX_TOKEN_COUNT}, 
};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program_pack::{IsInitialized, Pack},
    pubkey::{Pubkey, PubkeyError},
};

pub struct Processor {}
  
impl Processor {
  pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
  ) -> ProgramResult {
    let instruction = AppInstruction::unpack(instruction_data)?;
    match instruction {
      AppInstruction::InitializePool {
        reserves,
      } => {
        msg!("Calling InitializePool function");
        Self::initialize_pool(reserves, program_id, accounts)
      }

      AppInstruction::AddLiquidity {
        deltas,
      } => {
        msg!("Calling AddLiquidity function");
        Self::add_liquidity(deltas, program_id, accounts)
      }

      AppInstruction::RemoveLiquidity { lpt } => {
        msg!("Calling RemoveLiquidity function");
        Self::remove_liquidity(lpt, program_id, accounts)
      }

      AppInstruction::Swap { amount, limit } => {
        msg!("Calling Swap function");
        Self::swap(amount, limit, program_id, accounts)
      }

      AppInstruction::FreezePool {} => {
        msg!("Calling FreezePool function");
        Self::freeze_pool(program_id, accounts)
      }

      AppInstruction::ThawPool {} => {
        msg!("Calling ThawPool function");
        Self::thaw_pool(program_id, accounts)
      }

      AppInstruction::Earn { amount } => {
        msg!("Calling Earn function");
        Self::earn(amount, program_id, accounts)
      }

      AppInstruction::TransferPoolOwnership {} => {
        msg!("Calling TransferPoolOwnership function");
        Self::transfer_pool_ownership(program_id, accounts)
      }
    }
  }

  pub fn initialize_pool(
    reserves: Vec<u64>,
    weights: Vec<64>,
    program_id: &Pubkey,
    accounts: &[AccountInfo],
  ) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let owner = next_account_info(accounts_iter)?; //pool owner
    let pool_acc = next_account_info(accounts_iter)?;
    let lpt_acc = next_account_info(accounts_iter)?;
    let mint_lpt_acc = next_account_info(accounts_iter)?;
    let vault_acc = next_account_info(accounts_iter)?; //owned by treasurer
    let proof_acc = next_account_info(accounts_iter)?; // program_id xor treasurer xor pool_id

    let treasurer = next_account_info(accounts_iter)?; //owner of treasury_s,a,b_acc
    let system_program = next_account_info(accounts_iter)?;
    let splt_program = next_account_info(accounts_iter)?;

    let sysvar_rent_acc = next_account_info(accounts_iter)?;
    let splata_program = next_account_info(accounts_iter)?; //create treasury_s,a,b_acc

    let mut src_accs = Vec::new();
    let mut mint_accs = Vec::new();
    let mut treasury_accs = Vec::new();

    let mut token_count = 0;
    for accounts in accounts_iter.chunks(3) {
      if accounts.len() < 3 {
        break;
      } else {
        let src_acc = next_account_info(accounts)?;
        let mint_acc = next_account_info(accounts)?;
        let treasury_acc = next_account_info(accounts)?;
    
        src_accs.push(src_acc);
        mint_accs.push(mint_acc);
        treasury_accs.push(treasury_acc);

        token_count++;
      }      
    }

    if token_count > MAX_TOKEN_COUNT || reserves.len() != src_acc.len() || src_acc.len() != mint_acc.len() || mint_acc.len() != treasury_acc.len() {
      return Err(AppError::ConstructorOnce.into());
    }

    Self::is_program(program_id, &[pool_acc])?;
    Self::is_signer(&[payer, pool_acc, vault_acc])?;

    let mut pool_data = Pool::unpack_unchecked(&pool_acc.data.borrow())?;
    let mint_lpt_data = Mint::unpack_unchecked(&mint_lpt_acc.data.borrow())?;
    let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];
    if pool_data.is_initialized() || mint_lpt_data.is_initialized() {
      return Err(AppError::ConstructorOnce.into());
    }

    let pool_treasurer_xor_key = match Self::key_xor(pool_acc.key, treasurer.key) {
      Ok(pool_treasurer_xor_key) => pool_treasurer_xor_key,
      Err(e) => {
        msg!("processor-initialize_pool: xor pool_acc-treasurer error");
        return Err(AppError::ConstructorOnce.into());
      }
    };

    let program_xor_key = match Self::key_xor(program_id, &pool_treasurer_xor_key) {
      Ok(program_xor_key) => program_xor_key,
      Err(e) => {
        msg!("processor-initialize_pool: xor program_id-pool_treasurer error");
        return Err(AppError::ConstructorOnce.into());
      }
    };

    if *proof_acc.key != program_xor_key {
      return Err(AppError::InvalidMint.into());
    }

    for itemReserve in &reserves {
      if itemReserve == 0 {
        return Err(AppError::ZeroValue.into());
      }
    }

    for i in 0..token_count {
      let src_acc = src_accs.get(i).ok_or(AppError::MissingAccount)?;
      let mint_acc = mint_accs.get(i).ok_or(AppError::MissingAccount)?;
      let treasury_acc = treasury_accs.get(i).ok_or(AppError::MissingAccount)?;      
      let reserve = reserves.get(i).ok_or(AppError::MissingAccount)?;
      // Initialize treasury_acc
      XSPLATA::initialize_account(
        payer,
        treasury_acc,
        treasurer,
        mint_acc,
        system_program,
        splt_program,
        sysvar_rent_acc,
        splata_program,
        &[],
      )?;
      // Deposit token S - src_s->treasury_s_acc (amount : reserve_s)
      XSPLT::transfer(
        reserves,
        src_acc,
        treasury_acc,
        payer,
        splt_program,
        &[],
      )?;
    }
    /////finished providing Liquidity/////

    let mint_acc = mint_accs.get(0).ok_or(AppError::MissingAccount)?;
    // Initialize mint
    let mint_data = Mint::unpack_unchecked(&mint_acc.data.borrow())?;
    XSPLT::initialize_mint(
      mint_data.decimals,
      mint_lpt_acc,
      treasurer,
      proof_acc,
      sysvar_rent_acc,
      splt_program,
      seed,
    )?;
    // Initialize lpt account(??? - lpt_acc's owner is payer?)
    XSPLATA::initialize_account(
      payer,
      lpt_acc,
      payer,
      mint_lpt_acc,
      system_program,
      splt_program,
      sysvar_rent_acc,
      splata_program,
      &[],
    )?;
    // Mint LPT  mint_lpt_acc->lpt_acc()
    XSPLT::mint_to(
      reserves[0],
      mint_lpt_acc,
      lpt_acc,
      treasurer,
      splt_program,
      seed,
    )?;

    // Initialize vault
    XSPLT::initialize_account(
      vault_acc,
      mint_acc,
      treasurer,
      sysvar_rent_acc,
      splt_program,
      &[],
    )?;

    // Update pool data
    pool_data.owner = *owner.key;
    pool_data.state = PoolState::Initialized;
    pool_data.mint_lpt = *mint_lpt_acc.key;
    pool_data.vault = *vault_acc.key; // lp token storage account

    for i in 0..token_count {
      let mint_item_acc = mint_accs.get(i).ok_or(AppError::MissingAccount)?;
      let treasury_item_acc = treasury_accs.get(i).ok_or(AppError::MissingAccount)?;      
      let reserve_item = reserves.get(i).ok_or(AppError::MissingAccount)?;

      pool_data.mint[i] = *mint_item_acc.key;
      pool_data.treasury[i] = *treasury_item_acc.key;
      pool_data.reserve[i] = reserve_item;
    }

    Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;

    Ok(())
  }

  pub fn add_liquidity(
    deltas: Vec<u64>,
    program_id: &Pubkey,
    accounts: &[AccountInfo],
  ) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let owner = next_account_info(accounts_iter)?;
    let pool_acc = next_account_info(accounts_iter)?;
    let lpt_acc = next_account_info(accounts_iter)?;
    let mint_lpt_acc = next_account_info(accounts_iter)?;

    let treasurer = next_account_info(accounts_iter)?;
    let splt_program = next_account_info(accounts_iter)?;

    let mut src_accs = Vec::new();
    let mut treasury_accs = Vec::new();

    let mut token_count = 0;
    for accounts in accounts_iter.chunks(2) {
      if accounts.len() < 2 {
        break;
      } else {
        let src_acc = next_account_info(accounts)?;
        let treasury_acc = next_account_info(accounts)?;
    
        src_accs.push(src_acc);
        treasury_accs.push(treasury_acc);

        token_count++;
      }      
    }

    if token_count > MAX_TOKEN_COUNT || deltas.len() != src_acc.len() || src_acc.len() != treasury_acc.len() {
      return Err(AppError::ConstructorOnce.into());
    }

    Self::is_program(program_id, &[pool_acc])?;
    Self::is_signer(&[owner])?;

    let mint_lpt_data = Mint::unpack(&mint_lpt_acc.data.borrow())?;
    let mut pool_data = Pool::unpack(&pool_acc.data.borrow())?;
    let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];

    if pool_data.mint_lpt != *mint_lpt_acc.key {
      return Err(AppError::InvalidOwner.into());
    }

    for i in 0..token_count {
      let treasury_acc = treasury_accs.get(i).ok_or(AppError::MissingAccount)?;
      if pool_data.treasury[i] != *treasury_acc.key {
        return Err(AppError::InvalidOwner.into());
      }
    }

    for itemDelta in &deltas {
      if (itemDelta == 0) {
        return Err(AppError::ZeroValue.into());
      }
    }

    let (lpt, reserves) = Oracle::rake(
      deltas,
      pool_data.reserves,
      mint_lpt_data.supply,
    )
    .ok_or(AppError::Overflow)?;

    // Deposit token
    for i in 0..token_count {
      if deltas[i] > 0 {
        XSPLT::transfer(deltas[i], src_accs[i], treasury_accs[i], owner, splt_program, &[])?;
        pool_data.reserves[i] = reserves[i];
      }
    }

    // Update pool
    Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;
    // Mint LPT
    XSPLT::mint_to(lpt, mint_lpt_acc, lpt_acc, treasurer, splt_program, seed)?;

        Ok(())
    }

    pub fn remove_liquidity(
        lpt: u64,
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let owner = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;
        let lpt_acc = next_account_info(accounts_iter)?;
        let mint_lpt_acc = next_account_info(accounts_iter)?;

        let dst_s_acc = next_account_info(accounts_iter)?;
        let treasury_s_acc = next_account_info(accounts_iter)?;

        let dst_a_acc = next_account_info(accounts_iter)?;
        let treasury_a_acc = next_account_info(accounts_iter)?;

        let dst_b_acc = next_account_info(accounts_iter)?;
        let treasury_b_acc = next_account_info(accounts_iter)?;

        let treasurer = next_account_info(accounts_iter)?;
        let splt_program = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[owner])?;
        let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];

        let mint_lpt_data = Mint::unpack(&mint_lpt_acc.data.borrow())?;
        let mut pool_data = Pool::unpack_from_slice(&pool_acc.data.borrow())?;
        if pool_data.mint_lpt != *mint_lpt_acc.key
            || pool_data.treasury_s != *treasury_s_acc.key
            || pool_data.treasury_a != *treasury_a_acc.key
            || pool_data.treasury_b != *treasury_b_acc.key
        {
            return Err(AppError::UnmatchedPool.into());
        }

        if pool_data.is_frozen() {
            return Err(AppError::FrozenPool.into());
        }

        if lpt == 0 {
            return Err(AppError::ZeroValue.into());
        }

        let delta_s = (lpt as u128)
            .checked_mul(pool_data.reserve_s as u128)
            .ok_or(AppError::Overflow)?
            .checked_div(mint_lpt_data.supply as u128)
            .ok_or(AppError::Overflow)? as u64;
        let delta_a = (lpt as u128)
            .checked_mul(pool_data.reserve_a as u128)
            .ok_or(AppError::Overflow)?
            .checked_div(mint_lpt_data.supply as u128)
            .ok_or(AppError::Overflow)? as u64;
        let delta_b = (lpt as u128)
            .checked_mul(pool_data.reserve_b as u128)
            .ok_or(AppError::Overflow)?
            .checked_div(mint_lpt_data.supply as u128)
            .ok_or(AppError::Overflow)? as u64;
        
        XSPLT::burn(lpt, lpt_acc, mint_lpt_acc, owner, splt_program, seed)?;
        
        pool_data.reserve_s = pool_data
            .reserve_s
            .checked_sub(delta_s)
            .ok_or(AppError::Overflow)?;
        pool_data.reserve_a = pool_data
            .reserve_a
            .checked_sub(delta_a)
            .ok_or(AppError::Overflow)?;
        pool_data.reserve_b = pool_data
            .reserve_b
            .checked_sub(delta_b)
            .ok_or(AppError::Overflow)?;

        if pool_data.reserve_s == 0 {
            pool_data.state = PoolState::Frozen;
        }
        Pool::pack_into_slice(pool_data, &mut pool_acc.data.borrow_mut())?;
        // Withdraw token
        XSPLT::transfer(
            delta_s,
            treasury_s_acc,
            dst_s_acc,
            treasurer,
            splt_program,
            seed,
        )?;
        XSPLT::transfer(
            delta_a,
            treasury_a_acc,
            dst_a_acc,
            treasurer,
            splt_program,
            seed,
        )?;
        XSPLT::transfer(
            delta_b,
            treasury_b_acc,
            dst_b_acc,
            treasurer,
            splt_program,
            seed,
        )?;

        Ok(())
    }

    pub fn swap(
        amount: u64,
        limit: u64,
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let payer = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;
        let vault_acc = next_account_info(accounts_iter)?;

        let src_acc = next_account_info(accounts_iter)?;
        let treasury_bid_acc = next_account_info(accounts_iter)?;

        let dst_acc = next_account_info(accounts_iter)?;
        let treasury_ask_acc = next_account_info(accounts_iter)?;

        let treasury_sen_acc = next_account_info(accounts_iter)?;

        let treasurer = next_account_info(accounts_iter)?;
        let splt_program = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[payer])?;

        let mut pool_data = Pool::unpack_from_slice(&pool_acc.data.borrow())?;
        let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];
        let (bid_code, bid_reserve) = pool_data
            .get_reserve(treasury_bid_acc.key)
            .ok_or(AppError::UnmatchedPool)?;
        let (ask_code, ask_reserve) = pool_data
            .get_reserve(treasury_ask_acc.key)
            .ok_or(AppError::UnmatchedPool)?;
        let (sen_code, _) = pool_data
            .get_reserve(treasury_sen_acc.key)
            .ok_or(AppError::UnmatchedPool)?;
        if sen_code != 0 {
          return Err(AppError::UnmatchedPool.into());
        }

        if pool_data.is_frozen() {
          return Err(AppError::FrozenPool.into());
        }
        if amount == 0 {
           return Err(AppError::ZeroValue.into());
        }
        if *treasury_bid_acc.key == *treasury_ask_acc.key {
          return Ok(());
        }

        let new_bid_reserve = bid_reserve.checked_add(amount).ok_or(AppError::Overflow)?;
        let (new_ask_reserve, paid_amount, earning) =
        Oracle::curve_in_fee(new_bid_reserve, bid_reserve, ask_reserve, ask_code == 0)
            .ok_or(AppError::Overflow)?;
        if paid_amount < limit {
           return Err(AppError::ExceedLimit.into());
        }

        XSPLT::transfer(amount, src_acc, treasury_bid_acc, payer, splt_program, &[])?;
        match bid_code {
            0 => pool_data.reserve_s = new_bid_reserve,
            1 => pool_data.reserve_a = new_bid_reserve,
            2 => pool_data.reserve_b = new_bid_reserve,
            _ => return Err(AppError::UnmatchedPool.into()),
        }
        match ask_code {
            0 => pool_data.reserve_s = new_ask_reserve,
            1 => pool_data.reserve_a = new_ask_reserve,
            2 => pool_data.reserve_b = new_ask_reserve,
            _ => return Err(AppError::UnmatchedPool.into()),
        }
        XSPLT::transfer(
            paid_amount,
            treasury_ask_acc,
            dst_acc,
            treasurer,
            splt_program,
            seed,
        )?;

        if earning != 0 {
        let new_ask_reserve_with_earning = new_ask_reserve
            .checked_add(earning)
            .ok_or(AppError::Overflow)?;
        let (new_sen_reserve, earning_in_sen, _) = Oracle::curve_in_fee(
            new_ask_reserve_with_earning, 
            new_ask_reserve,              
            pool_data.reserve_s,
            true,
        )
        .ok_or(AppError::Overflow)?;
        match ask_code {
            1 => pool_data.reserve_a = new_ask_reserve_with_earning,
            2 => pool_data.reserve_b = new_ask_reserve_with_earning,
            _ => return Err(AppError::UnmatchedPool.into()),
        }
        pool_data.reserve_s = new_sen_reserve;
        XSPLT::transfer(
            earning_in_sen,
            treasury_sen_acc,
            vault_acc,
            treasurer,
            splt_program,
            seed,
        )?;
        }

        Pool::pack_into_slice(pool_data, &mut pool_acc.data.borrow_mut())?;

        Ok(())
    } 

    pub fn freeze_pool(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let owner = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[owner])?;
        Self::is_pool_owner(owner, pool_acc)?;

        let mut pool_data = Pool::unpack(&pool_acc.data.borrow())?;
        pool_data.state = PoolState::Frozen;
        Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;

        Ok(())
    }

    pub fn thaw_pool(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let owner = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[owner])?;
        Self::is_pool_owner(owner, pool_acc)?;

        let mut pool_data = Pool::unpack(&pool_acc.data.borrow())?;
        pool_data.state = PoolState::Initialized;
        Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;

        Ok(())
    }    

    pub fn earn(amount: u64, program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let owner = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;
        let vault_acc = next_account_info(accounts_iter)?;
        let dst_acc = next_account_info(accounts_iter)?;
        let treasurer = next_account_info(accounts_iter)?;
        let splt_program = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[owner])?;
        Self::is_pool_owner(owner, pool_acc)?;

        let pool_data = Pool::unpack(&pool_acc.data.borrow())?;
        let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];
        if pool_data.vault != *vault_acc.key {
            return Err(AppError::InvalidOwner.into());
        }

        if amount == 0 {
            return Err(AppError::ZeroValue.into());
        }
        
        XSPLT::transfer(amount, vault_acc, dst_acc, treasurer, splt_program, seed)?;

        Ok(())
    }

  pub fn transfer_pool_ownership(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let owner = next_account_info(accounts_iter)?;
    let pool_acc = next_account_info(accounts_iter)?;
    let new_owner = next_account_info(accounts_iter)?;

    Self::is_program(program_id, &[pool_acc])?;
    Self::is_signer(&[owner])?;
    Self::is_pool_owner(owner, pool_acc)?;

    // Update pool data
    let mut pool_data = Pool::unpack(&pool_acc.data.borrow())?;
    pool_data.owner = *new_owner.key;
    Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;

    Ok(())
  }

  ///
  /// Utilities
  ///
  pub fn is_program(program_id: &Pubkey, accounts: &[&AccountInfo]) -> ProgramResult {
    for acc in &mut accounts.iter() {
      if acc.owner != program_id {
        return Err(AppError::IncorrectProgramId.into());
      }
    }
    Ok(())
  }

  pub fn is_signer(accounts: &[&AccountInfo]) -> ProgramResult {
    for acc in &mut accounts.iter() {
      if !acc.is_signer {
        return Err(AppError::InvalidOwner.into());
      }
    }
    Ok(())
  }

    pub fn is_pool_owner(owner: &AccountInfo, pool_acc: &AccountInfo) -> ProgramResult {
        let pool_data = Pool::unpack(&pool_acc.data.borrow())?;
        if pool_data.owner != *owner.key {
          return Err(AppError::InvalidOwner.into());
        }

        Ok(())
    }

    pub fn safe_seed(
        seed_acc: &AccountInfo,
        expected_acc: &AccountInfo,
        program_id: &Pubkey,
    ) -> Result<[u8; 32], PubkeyError> {
        let seed: [u8; 32] = seed_acc.key.to_bytes();
        let key = Pubkey::create_program_address(&[&seed], program_id)?;
        if key != *expected_acc.key {
          return Err(PubkeyError::InvalidSeeds);
        }
        Ok(seed)
    }

  pub fn key_xor(
    left_key: &Pubkey,
    right_key: &Pubkey,
  ) -> Result<Pubkey, PubkeyError> {
    let left_key_bytes: [u8; 32] = left_key.to_bytes();
    let right_key_bytes: [u8; 32] = right_key.to_bytes();
    let mut xor_key_bytes: [u8; 32] = [0; 32];   

    for i in 0..32 {
      xor_key_bytes[i] = left_key_bytes[i] ^ right_key_bytes[i];
    }

    let xor_key = Pubkey::new_from_array(xor_key_bytes);
    
    Ok(xor_key)
  }
}