use crate::interfaces::isplt::ISPLT;
use solana_program::{
  account_info::AccountInfo, entrypoint::ProgramResult, program::invoke_signed,
};

pub struct XSPLT {}

impl XSPLT {
  pub fn initialize_mint<'a>(
    decimals: u8,
    mint_acc: &AccountInfo<'a>,
    owner: &AccountInfo<'a>,
    freeze_authority: &AccountInfo<'a>,
    sysvar_rent_acc: &AccountInfo<'a>,
    splt_program: &AccountInfo<'a>,
    seed: &[&[&[u8]]],
  ) -> ProgramResult {
    let ix = ISPLT::initialize_mint(
      decimals,
      *mint_acc.key,
      *owner.key,
      *freeze_authority.key,
      *sysvar_rent_acc.key,
      *splt_program.key,
    )?;
    invoke_signed(
      &ix,
      &[
        mint_acc.clone(),
        sysvar_rent_acc.clone(),
        splt_program.clone(),
      ],
      seed,
    )?;
    Ok(())
  }

  pub fn initialize_account<'a>(
    target_acc: &AccountInfo<'a>,
    mint_acc: &AccountInfo<'a>,
    owner: &AccountInfo<'a>,
    sysvar_rent_acc: &AccountInfo<'a>,
    splt_program: &AccountInfo<'a>,
    seed: &[&[&[u8]]],
  ) -> ProgramResult {
    let ix = ISPLT::initialize_account(
      *target_acc.key,
      *mint_acc.key,
      *owner.key,
      *sysvar_rent_acc.key,
      *splt_program.key,
    )?;
    invoke_signed(
      &ix,
      &[
        target_acc.clone(),
        mint_acc.clone(),
        owner.clone(),
        sysvar_rent_acc.clone(),
        splt_program.clone(),
      ],
      seed,
    )?;
    Ok(())
  }

  pub fn transfer<'a>(
    amount: u64,
    src_acc: &AccountInfo<'a>,
    dst_acc: &AccountInfo<'a>,
    owner: &AccountInfo<'a>,
    splt_program: &AccountInfo<'a>,
    seed: &[&[&[u8]]],
  ) -> ProgramResult {
    let ix = ISPLT::transfer(
      amount,
      *src_acc.key,
      *dst_acc.key,
      *owner.key,
      *splt_program.key,
    )?;
    invoke_signed(
      &ix,
      &[
        src_acc.clone(),
        dst_acc.clone(),
        owner.clone(),
        splt_program.clone(),
      ],
      seed,
    )?;
    Ok(())
  }

  pub fn mint_to<'a>(
    amount: u64,
    mint_acc: &AccountInfo<'a>,
    dst_acc: &AccountInfo<'a>,
    owner: &AccountInfo<'a>,
    splt_program: &AccountInfo<'a>,
    seed: &[&[&[u8]]],
  ) -> ProgramResult {
    let ix = ISPLT::mint_to(
      amount,
      *mint_acc.key,
      *dst_acc.key,
      *owner.key,
      *splt_program.key,
    )?;
    invoke_signed(
      &ix,
      &[
        mint_acc.clone(),
        dst_acc.clone(),
        owner.clone(),
        splt_program.clone(),
      ],
      seed,
    )?;
    Ok(())
  }

  pub fn burn<'a>(
    amount: u64,
    src_acc: &AccountInfo<'a>,
    mint_acc: &AccountInfo<'a>,
    owner: &AccountInfo<'a>,
    splt_program: &AccountInfo<'a>,
    seed: &[&[&[u8]]],
  ) -> ProgramResult {
    let ix = ISPLT::burn(
      amount,
      *src_acc.key,
      *mint_acc.key,
      *owner.key,
      *splt_program.key,
    )?;
    invoke_signed(
      &ix,
      &[
        src_acc.clone(),
        mint_acc.clone(),
        owner.clone(),
        splt_program.clone(),
      ],
      seed,
    )?;
    Ok(())
  }
  
  pub fn close_account<'a>(
    src_acc: &AccountInfo<'a>,
    dst_acc: &AccountInfo<'a>,
    owner: &AccountInfo<'a>,
    splt_program: &Accou    ntInfo<'a>,
    seed: &[&[&[u8]]],
  ) -> ProgramResult {
    let ix = ISPLT::close_account(*src_acc.key, *dst_acc.key, *owner.key, *splt_program.key)?;
    invoke_signed(
      &ix,
      &[
        src_acc.clone(),
        dst_acc.clone(),
        owner.clone(),
        splt_program.clone(),
      ],
      seed,
    )?;
    Ok(())
  }
}
