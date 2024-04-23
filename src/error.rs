use num_derive::FromPrimitive as DeriveFromPrimitive;
use num_traits::FromPrimitive;
use solana_program::{
  decode_error::DecodeError,
  msg,
  program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

pub use solana_program::program_error::PrintProgramError as PrintAppError;

#[derive(Clone, Debug, Eq, Error, DeriveFromPrimitive, PartialEq)]
pub enum AppError {
  #[error("Invalid instruction")]
  InvalidInstruction,
  #[error("Invalid owner")]
  InvalidOwner,
  #[error("Incorrect program id")]
  IncorrectProgramId,
  #[error("Already constructed")]
  ConstructorOnce,
  #[error("Zero value")]
  ZeroValue,
  #[error("Invalid mint")]
  InvalidMint,  
}

impl From<AppError> for ProgramError {
  fn from(e: AppError) -> Self {
    ProgramError::Custom(e as u32)
  }
}

impl<T> DecodeError<T> for AppError {
  fn type_of() -> &'static str {
    "AppError"
  }
}

impl PrintProgramError for AppError {
  fn print<E>(&self)
  where
    E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + FromPrimitive,
  {
    match self {
      AppError::InvalidInstruction => msg!("Error: Invalid instruction"),
      AppError::InvalidOwner => msg!("Error: Invalid owner"),
      AppError::IncorrectProgramId => msg!("Error: Incorrect program id"),
      AppError::ConstructorOnce => msg!("Error: Already constructed"),
      AppError::ZeroValue => msg!("Error: Zero value"),      
      AppError::InvalidMint => msg!("Error: Invalid mint"),
    }
  }
}
