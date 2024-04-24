use crate::error::AppError;
use crate::instruction::AppInstruction;
use crate::interfaces::{xsplata::XSPLATA, xsplt::XSPLT};
use crate::schema::{
    mint::Mint,
    pool::{Pool, PoolState},
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
                reserve_s,
                reserve_a,
                reserve_b,
            } => {        
                Self::initialize_pool(reserve_s, reserve_a, reserve_b, program_id, accounts)
            }

            AppInstruction::AddLiquidity {
                delta_s,
                delta_a,
                delta_b,
            } => {        
                Self::add_liquidity(delta_s, delta_a, delta_b, program_id, accounts)
            }

            AppInstruction::RemoveLiquidity { lpt } => {        
                Self::remove_liquidity(lpt, program_id, accounts)
            }

            AppInstruction::Swap { amount, limit } => {        
                Self::swap(amount, limit, program_id, accounts)
            }
        }
    }

    pub fn initialize_pool(
        reserve_s: u64,
        reserve_a: u64,
        reserve_b: u64,
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let payer = next_account_info(accounts_iter)?;
        let owner = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;
        let lpt_acc = next_account_info(accounts_iter)?;
        let mint_lpt_acc = next_account_info(accounts_iter)?;
        let vault_acc = next_account_info(accounts_iter)?;
        let proof_acc = next_account_info(accounts_iter)?; 

        let src_s_acc = next_account_info(accounts_iter)?;
        let mint_s_acc = next_account_info(accounts_iter)?;
        let treasury_s_acc = next_account_info(accounts_iter)?;

        let src_a_acc = next_account_info(accounts_iter)?;
        let mint_a_acc = next_account_info(accounts_iter)?;
        let treasury_a_acc = next_account_info(accounts_iter)?;

        let src_b_acc = next_account_info(accounts_iter)?;
        let mint_b_acc = next_account_info(accounts_iter)?;
        let treasury_b_acc = next_account_info(accounts_iter)?;

        let treasurer = next_account_info(accounts_iter)?;
        let system_program = next_account_info(accounts_iter)?;
        let splt_program = next_account_info(accounts_iter)?;
        let sysvar_rent_acc = next_account_info(accounts_iter)?;
        let splata_program = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[payer, pool_acc, vault_acc])?;

        let mut pool_data = Pool::unpack_unchecked(&pool_acc.data.borrow())?;
        let mint_lpt_data = Mint::unpack_unchecked(&mint_lpt_acc.data.borrow())?;
        let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];
        if pool_data.is_initialized() || mint_lpt_data.is_initialized() {
            return Err(AppError::ConstructorOnce.into());
        }

        if *proof_acc.key != program_id.xor(&(pool_acc.key.xor(treasurer.key)))
        || *mint_s_acc.key == *mint_a_acc.key
        || *mint_s_acc.key == *mint_b_acc.key
        {
            return Err(AppError::InvalidMint.into());
        }

        if reserve_s == 0 || reserve_a == 0 || reserve_b == 0 {
            return Err(AppError::ZeroValue.into());
        }

        XSPLATA::initialize_account(
            payer,
            treasury_s_acc,
            treasurer,
            mint_s_acc,
            system_program,
            splt_program,
            sysvar_rent_acc,
            splata_program,
            &[],
        )?;
        
        XSPLT::transfer(
            reserve_s,
            src_s_acc,
            treasury_s_acc,
            payer,
            splt_program,
            &[],
        )?;
      
        XSPLATA::initialize_account(
            payer,
            treasury_a_acc,
            treasurer,
            mint_a_acc,
            system_program,
            splt_program,
            sysvar_rent_acc,
            splata_program,
            &[],
        )?;
        
        XSPLT::transfer(
            reserve_a,
            src_a_acc,
            treasury_a_acc,
            payer,
            splt_program,
            &[],
        )?;
      
        XSPLATA::initialize_account(
            payer,
            treasury_b_acc,
            treasurer,
            mint_b_acc,
            system_program,
            splt_program,
            sysvar_rent_acc,
            splata_program,
            &[],
        )?;
        
        XSPLT::transfer(
            reserve_b,
            src_b_acc,
            treasury_b_acc,
            payer,
            splt_program,
            &[],
        )?;
      
            let mint_s_data = Mint::unpack_unchecked(&mint_s_acc.data.borrow())?;
        XSPLT::initialize_mint(
            mint_s_data.decimals,
            mint_lpt_acc,
            treasurer,
            proof_acc,
            sysvar_rent_acc,
            splt_program,
            seed,
        )?;
        
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
        
        XSPLT::mint_to(
            reserve_s,
            mint_lpt_acc,
            lpt_acc,
            treasurer,
            splt_program,
            seed,
        )?;
      
        XSPLT::initialize_account(
            vault_acc,
            mint_s_acc,
            treasurer,
            sysvar_rent_acc,
            splt_program,
            &[],
        )?;

        pool_data.owner = *owner.key;
        pool_data.state = PoolState::Initialized;
        pool_data.mint_lpt = *mint_lpt_acc.key;
        pool_data.vault = *vault_acc.key;
        pool_data.mint_s = *mint_s_acc.key;
        pool_data.treasury_s = *treasury_s_acc.key;
        pool_data.reserve_s = reserve_s;
        pool_data.mint_a = *mint_a_acc.key;
        pool_data.treasury_a = *treasury_a_acc.key;
        pool_data.reserve_a = reserve_a;
        pool_data.mint_b = *mint_b_acc.key;
        pool_data.treasury_b = *treasury_b_acc.key;
        pool_data.reserve_b = reserve_b;
        Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;

        Ok(())
    }

    pub fn add_liquidity(
        delta_s: u64,
        delta_a: u64,
        delta_b: u64,
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let owner = next_account_info(accounts_iter)?;
        let pool_acc = next_account_info(accounts_iter)?;
        let lpt_acc = next_account_info(accounts_iter)?;
        let mint_lpt_acc = next_account_info(accounts_iter)?;

        let src_s_acc = next_account_info(accounts_iter)?;
        let treasury_s_acc = next_account_info(accounts_iter)?;

        let src_a_acc = next_account_info(accounts_iter)?;
        let treasury_a_acc = next_account_info(accounts_iter)?;

        let src_b_acc = next_account_info(accounts_iter)?;
        let treasury_b_acc = next_account_info(accounts_iter)?;

        let treasurer = next_account_info(accounts_iter)?;
        let splt_program = next_account_info(accounts_iter)?;

        Self::is_program(program_id, &[pool_acc])?;
        Self::is_signer(&[owner])?;

        let mint_lpt_data = Mint::unpack(&mint_lpt_acc.data.borrow())?;
        let mut pool_data = Pool::unpack(&pool_acc.data.borrow())?;
        let seed: &[&[&[u8]]] = &[&[&Self::safe_seed(pool_acc, treasurer, program_id)?[..]]];

        if pool_data.mint_lpt != *mint_lpt_acc.key
            || pool_data.treasury_s != *treasury_s_acc.key
            || pool_data.treasury_a != *treasury_a_acc.key
            || pool_data.treasury_b != *treasury_b_acc.key
        {
            return Err(AppError::InvalidOwner.into());
        }

        if delta_s == 0 && delta_a == 0 && delta_b == 0 {
            return Err(AppError::ZeroValue.into());
        }

        let (lpt, reserve_s, reserve_a, reserve_b) = Oracle::rake(
            delta_s,
            delta_a,
            delta_b,
            pool_data.reserve_s,
            pool_data.reserve_a,
            pool_data.reserve_b,
            mint_lpt_data.supply,
        )
        .ok_or(AppError::Overflow)?;

        if delta_s > 0 {
            XSPLT::transfer(delta_s, src_s_acc, treasury_s_acc, owner, splt_program, &[])?;
            pool_data.reserve_s = reserve_s;
        }
        if delta_a > 0 {
            XSPLT::transfer(delta_a, src_a_acc, treasury_a_acc, owner, splt_program, &[])?;
            pool_data.reserve_a = reserve_a;
        }
        if delta_b > 0 {
            XSPLT::transfer(delta_b, src_b_acc, treasury_b_acc, owner, splt_program, &[])?;
            pool_data.reserve_b = reserve_b;
        }
        Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;
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
        let mut pool_data = Pool::unpack(&pool_acc.data.borrow())?;
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
        Pool::pack(pool_data, &mut pool_acc.data.borrow_mut())?;
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
        Ok(())
    }

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
}