pub trait Roots {
    fn sqrt(self) -> Self;
    fn cbrt(self) -> Self;
  }
  
  impl Roots for u128 {
    fn sqrt(self) -> Self {
      if self < 2 {
        return self;
      }
  
      let bits = (128 - self.leading_zeros() + 1) / 2;
      let mut start = 1 << (bits - 1);
      let mut end = 1 << (bits + 1);
      while start < end {
        end = (start + end) / 2;
        start = self / end;
      }
      end
    }

    fn cbrt(self) -> Self {
      if self < 2 {
        return self;
      }
  
      let bits = (128 - self.leading_zeros()) / 3;
      let mut end: u128 = 1 << bits;
      loop {
        let next = (self / end.pow(2) + 2 * end) / 3;
        if end != next {
          end = next;
        } else {
          break;
        }
      }
      end
    }
  }
  