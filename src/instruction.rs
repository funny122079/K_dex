use crate::error::AppError;
use solana_program::program_error::ProgramError;
use std::convert::TryInto;

#[derive(Clone, Debug, PartialEq)]
pub enum AppInstruction {
  InitializePool {
    reserve_s: u64,
    reserve_a: u64,
    reserve_b: u64,
  },
  AddLiquidity {
    delta_s: u64,
    delta_a: u64,
    delta_b: u64,
  },
  RemoveLiquidity {
    lpt: u64,
  },
  Swap {
    amount: u64,
    limit: u64,
  }
}

impl AppInstruction {
}
    