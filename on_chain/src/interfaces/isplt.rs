use solana_program::{
    instruction::{AccountMeta, Instruction},
    program_error::ProgramError,
    pubkey::Pubkey,
  };
  use std::mem::size_of;
  
  pub struct ISPLT {}
  
  impl ISPLT {
    pub fn initialize_mint(
      decimals: u8,
      mint_acc: Pubkey,
      owner: Pubkey,
      freeze_authority: Pubkey,
      sysvar_rent_acc: Pubkey,
      program_id: Pubkey,
    ) -> Result<Instruction, ProgramError> {
      let mut data = Vec::with_capacity(size_of::<Self>());
      data.push(0);
      data.push(decimals);
      data.extend_from_slice(&owner.to_bytes());
      data.push(1);
      data.extend_from_slice(&freeze_authority.to_bytes());
      let mut accounts = Vec::with_capacity(2);
      accounts.push(AccountMeta::new(mint_acc, false));
      accounts.push(AccountMeta::new_readonly(sysvar_rent_acc, false));
      Ok(Instruction {
        program_id,
        accounts,
        data,
      })
    }
    pub fn initialize_account(
      target_acc: Pubkey,
      mint_acc: Pubkey,
      owner: Pubkey,
      sysvar_rent_acc: Pubkey,
      program_id: Pubkey,
    ) -> Result<Instruction, ProgramError> {
      let mut data = Vec::with_capacity(size_of::<Self>());
      data.push(1);
      let mut accounts = Vec::with_capacity(4);
      accounts.push(AccountMeta::new(target_acc, false));
      accounts.push(AccountMeta::new_readonly(mint_acc, false));
      accounts.push(AccountMeta::new_readonly(owner, false));
      accounts.push(AccountMeta::new_readonly(sysvar_rent_acc, false));
      Ok(Instruction {
        program_id,
        accounts,
        data,
      })
    }
    pub fn transfer(
      amount: u64,
      src_acc: Pubkey,
      dst_acc: Pubkey,
      owner: Pubkey,
      program_id: Pubkey,
    ) -> Result<Instruction, ProgramError> {
      let mut data = Vec::with_capacity(size_of::<Self>());
      data.push(3);
      data.extend_from_slice(&amount.to_le_bytes());
      let mut accounts = Vec::with_capacity(3);
      accounts.push(AccountMeta::new(src_acc, false));
      accounts.push(AccountMeta::new(dst_acc, false));
      accounts.push(AccountMeta::new_readonly(owner, true));
      Ok(Instruction {
        program_id,
        accounts,
        data,
      })
    }
    
    pub fn mint_to(
      amount: u64,
      mint_acc: Pubkey,
      dst_acc: Pubkey,
      owner: Pubkey,
      program_id: Pubkey,
    ) -> Result<Instruction, ProgramError> {
      let mut data = Vec::with_capacity(size_of::<Self>());
      data.push(7);
      data.extend_from_slice(&amount.to_le_bytes());
      let mut accounts = Vec::with_capacity(3);
      accounts.push(AccountMeta::new(mint_acc, false));
      accounts.push(AccountMeta::new(dst_acc, false));
      accounts.push(AccountMeta::new_readonly(owner, true));
      Ok(Instruction {
        program_id,
        accounts,
        data,
      })
    }
    
    pub fn burn(
      amount: u64,
      src_acc: Pubkey,
      mint_acc: Pubkey,
      owner: Pubkey,
      program_id: Pubkey,
    ) -> Result<Instruction, ProgramError> {
      let mut data = Vec::with_capacity(size_of::<Self>());
      data.push(8);
      data.extend_from_slice(&amount.to_le_bytes());
      let mut accounts = Vec::with_capacity(3);
      accounts.push(AccountMeta::new(src_acc, false));
      accounts.push(AccountMeta::new(mint_acc, false));
      accounts.push(AccountMeta::new_readonly(owner, true));
      Ok(Instruction {
        program_id,
        accounts,
        data,
      })
    }
    
    pub fn close_account(
      src_acc: Pubkey,
      dst_acc: Pubkey,
      owner: Pubkey,
      program_id: Pubkey,
    ) -> Result<Instruction, ProgramError> {
      let mut data = Vec::with_capacity(size_of::<Self>());
      data.push(9);
      let mut accounts = Vec::with_capacity(3);
      accounts.push(AccountMeta::new(src_acc, false));
      accounts.push(AccountMeta::new(dst_acc, false));
      accounts.push(AccountMeta::new_readonly(owner, true));
      Ok(Instruction {
        program_id,
        accounts,
        data,
      })
    }
  }
  