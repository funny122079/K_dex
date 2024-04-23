use crate::error::AppError;
use crate::instruction::AppInstruction;
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
        Ok(())
    }

    pub fn add_liquidity(
        delta_s: u64,
        delta_a: u64,
        delta_b: u64,
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        Ok(())
    }

    pub fn remove_liquidity(
        lpt: u64,
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
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