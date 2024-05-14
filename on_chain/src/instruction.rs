use crate::error::AppError;
use solana_program::program_error::ProgramError;
use std::convert::TryInto;

#[derive(Clone, Debug, PartialEq)]
pub enum AppInstruction {
  InitializePool {
    reserves: Vec<u64>,
  },
  AddLiquidity {
    deltas: Vec<u64>,
  },
  RemoveLiquidity {
    lpt: u64,
  },
  Swap {
    amount: u64,
    limit: u64,
  },
  FreezePool,
  ThawPool,
  Earn {
    amount: u64,
  },
  TransferPoolOwnership,
}

impl AppInstruction {
  pub fn unpack(instruction: &[u8]) -> Result<Self, ProgramError> {
    let (&tag, rest) = instruction
      .split_first()
      .ok_or(AppError::InvalidInstruction)?;
    Ok(match tag {
      0 => {
        let restSize = rest.len();
        let mut offset = 0;
        let mut reserves = Vec::new();

        while (offset + 8) <= restSize {
            let reserve = rest
                .get(offset..offset+8)
                .and_then(|slice| slice.try_into().ok())
                .map(u64::from_le_bytes)
                .ok_or(AppError::InvalidInstruction)?;

            reserves.push(reserve);
            offset += 8;
        }

        Self::InitializePool {
          reserves,
        }
      }
      1 => {
        let restSize = rest.len();
        let mut offset = 0;
        let mut deltas = Vec::new();

        while (offset + 8) <= restSize {
            let delta = rest
                .get(offset..offset+8)
                .and_then(|slice| slice.try_into().ok())
                .map(u64::from_le_bytes)
                .ok_or(AppError::InvalidInstruction)?;

            deltas.push(delta);
            offset += 8;
        }

        Self::AddLiquidity {
          deltas,
        }
      }
      2 => {
        let lpt = rest
          .get(..8)
          .and_then(|slice| slice.try_into().ok())
          .map(u64::from_le_bytes)
          .ok_or(AppError::InvalidInstruction)?;
        Self::RemoveLiquidity { lpt }
      }
      3 => {
        let amount = rest
          .get(..8)
          .and_then(|slice| slice.try_into().ok())
          .map(u64::from_le_bytes)
          .ok_or(AppError::InvalidInstruction)?;
        let limit = rest
          .get(8..16)
          .and_then(|slice| slice.try_into().ok())
          .map(u64::from_le_bytes)
          .ok_or(AppError::InvalidInstruction)?;
        Self::Swap { amount, limit }
      }
      4 => Self::FreezePool,
      5 => Self::ThawPool,
      6 => {
        let amount = rest
          .get(..8)
          .and_then(|slice| slice.try_into().ok())
          .map(u64::from_le_bytes)
          .ok_or(AppError::InvalidInstruction)?;
        Self::Earn { amount }
      }
      7 => Self::TransferPoolOwnership,
      _ => return Err(AppError::InvalidInstruction.into()),
    })
  }
}
    