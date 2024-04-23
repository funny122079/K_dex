use crate::error::AppError;
use crate::instruction::AppInstruction;
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
}