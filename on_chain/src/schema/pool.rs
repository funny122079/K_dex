use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use num_enum::TryFromPrimitive;
use solana_program::{
  msg,
  program_error::ProgramError,
  program_pack::{IsInitialized, Pack, Sealed},
  pubkey::Pubkey,
};

const MAX_TOKEN_COUNT: u8 = 6;

///
/// Pool state
///
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, TryFromPrimitive)]
pub enum PoolState {
  Uninitialized,
  Initialized,
  Frozen,
}
impl Default for PoolState {
  fn default() -> Self {
    PoolState::Uninitialized
  }
}

#[derive(Clone, Copy, Debug, Default, PartialEq)]
pub struct Pool {
  pub owner: Pubkey,
  pub state: PoolState,
  pub mint_lpt: Pubkey,
  pub vault: Pubkey,

  pub mints: Vec<Pubkey>,  
  pub treasurys: Vec<Pubkey>,
  pub reserves: Vec<u64>,
}

impl Pool {
  pub fn is_frozen(&self) -> bool {
    self.state == PoolState::Frozen
  }
  
  pub fn get_reserve(&self, treasury: &Pubkey) -> Option<(u8, u64)> {
    for (index, &treasure_item) in self.treasurys.iter().enumerate() {
      if treasure_item == *treasury {          
          return Some((index, self.reserves[index]));
      }
    }

    None
  }
}

impl Sealed for Pool {}

impl IsInitialized for Pool {
  fn is_initialized(&self) -> bool {
    self.state != PoolState::Uninitialized
  }
}

impl Pack for Pool {
  const LEN: usize = 32 + 1 + 32 + 32 + MAX_TOKEN_COUNT * (32 + 32 + 8);
  
  fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
    msg!("Pack-unpack_from_slice: read pool data");
    let src = array_ref![src, 0, LEN];
    let (
      owner,
      state,
      mint_lpt,
      vault,      
    ) = array_refs![src, 32, 1, 32, 32];
    
    const preDataSize = 32 + 1 + 32 + 32;
    const tokenDataSize = 32 + 32 + 8;
    let mut mints = Vec::new();
    let mut treasurys = Vec::new();
    let mut reserves = Vec::new();

    for i in 0..MAX_TOKEN_COUNT {
      let beginPos = preDataSize + i * tokenDataSize;
      let token_data = &src[beginPos..beginPos + tokenDataSize];
      let (mint, treasury, reserve) = array_refs![token_data, 32, 32, 8];

      let mintPubKey = PubKey::new_from_array(*mint);
      let treasuryPubKey = PubKey::new_from_array(*treasury);
      let reservePubKey = PubKey::new_from_array(*reserve);
    
      mints.push(mintPubKey);
      treasurys.push(treasuryPubKey);
      reserves.push(reservePubKey);
    }
    
    Ok(Pool {
      owner: Pubkey::new_from_array(*owner),
      state: PoolState::try_from_primitive(state[0]).or(Err(ProgramError::InvalidAccountData))?,
      mint_lpt: Pubkey::new_from_array(*mint_lpt),
      vault: Pubkey::new_from_array(*vault),
      mints: mints,
      treasurys: treasurys,
      reserves: reserves,      
    })
  }

  const LEN: usize = 32 + 1 + 32 + 32 + MAX_TOKEN_COUNT * (32 + 32 + 8 * 3);

fn pack_into_slice(&self, dst: &mut [u8]) {
    msg!("Pack-pack_into_slice");
    
    // Initialization and packing for non-token data goes here...

    // Calculate the size of one token data
    let token_data_size = 32 + 32 + 8;

    // Loop over the tokens
    for i in 0..MAX_TOKEN_COUNT {
        // Calculate the start index for the i-th token data
        let start = /* size of the data before the tokens */ + i * token_data_size;
        let dst_token = array_mut_ref![dst, start, token_data_size];

        // Break the token's destination slice into mint, treasury, and reserve
        let (dst_mint, dst_treasury, dst_reserve) = mut_array_refs![dst_token, 32, 32, 8];

        // Retrieve the token data; we'll use placeholder values here
        let mint = self.mints[i];
        let treasury = self.treasuries[i];
        let reserve = self.reserves[i];

        // Copy the token's data into the destination slice
        dst_mint.copy_from_slice(mint.as_ref());
        dst_treasury.copy_from_slice(treasury.as_ref());
        *dst_reserve = reserve.to_le_bytes();
    }
}

  // Pack data from the data struct to [u8]
  fn pack_into_slice(&self, dst: &mut [u8]) {
    msg!("Pack-pack_into_slice");
    let dst = array_mut_ref![dst, 0, 313];
    let (
      dst_owner,
      dst_state,
      dst_mint_lpt,
      dst_vault,
      dst_mint_s,
      dst_treasury_s,
      dst_reserve_s,
      dst_mint_a,
      dst_treasury_a,
      dst_reserve_a,
      dst_mint_b,
      dst_treasury_b,
      dst_reserve_b,
    ) = mut_array_refs![dst, 32, 1, 32, 32, 32, 32, 8, 32, 32, 8, 32, 32, 8];
    let &Pool {
      ref owner,
      state,
      ref mint_lpt,
      ref vault,
      ref mint_s,
      ref treasury_s,
      reserve_s,
      ref mint_a,
      ref treasury_a,
      reserve_a,
      ref mint_b,
      ref treasury_b,
      reserve_b,
    } = self;
    dst_owner.copy_from_slice(owner.as_ref());
    *dst_state = [state as u8];
    dst_mint_lpt.copy_from_slice(mint_lpt.as_ref());
    dst_vault.copy_from_slice(vault.as_ref());
    dst_mint_s.copy_from_slice(mint_s.as_ref());
    dst_treasury_s.copy_from_slice(treasury_s.as_ref());
    *dst_reserve_s = reserve_s.to_le_bytes();
    dst_mint_a.copy_from_slice(mint_a.as_ref());
    dst_treasury_a.copy_from_slice(treasury_a.as_ref());
    *dst_reserve_a = reserve_a.to_le_bytes();
    dst_mint_b.copy_from_slice(mint_b.as_ref());
    dst_treasury_b.copy_from_slice(treasury_b.as_ref());
    *dst_reserve_b = reserve_b.to_le_bytes();
  }
}
