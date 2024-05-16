import styled, { css } from "styled-components";
import PropTypes from "prop-types";

type ColoredTextProps = {
  emphazised?: string;
  text_attr_kinds?: string;
  fonttype?: string;
  font_name?: string;
  semi_transparent?: string;
  backgroundType?: number;
};

const ColoredText = styled.span<ColoredTextProps>`  
  align-items: center;  
  color: ${(props) => {
    if (props.text_attr_kinds === 'other_color') {
      return "#FFFFFFFF";
    } else {
      if (props.text_attr_kinds === 'secondary') {
        return props.theme.colors.secondaryCta;
      } else {
        return "#555555FF";
      }
    }
  }};
  font-weight: ${(props) => (props.emphazised === 'bold' ? "bold" : "normal")};
  justify-content: center;
  
  ${(props) =>
    props.backgroundType == 1 &&
    css`
    background-color: rgb(32, 197, 14);
    border-radius: 0.8vw;
    width: 4vw;
    `}

  ${(props) =>
    props.fonttype === "tinytiny" &&
    css`
      font-size: 0.9rem;
    `}

  ${(props) =>
    props.fonttype === "tiny" &&
    css`
      font-size: 1rem;
    `}
  
  ${(props) =>
    props.fonttype === "semiSmallTiny" &&
    css`
      font-size: 1.2rem;
    `}

  ${(props) =>
    props.fonttype === "semiMidTiny" &&
    css`
      font-size: 1.3rem;
    `}

  ${(props) =>
    props.fonttype === "semiTiny" &&
    css`
      font-size: 1.5rem;
    `}

  ${(props) =>
    props.fonttype === "small" &&
    css`
      font-size: 2rem;
    `}

  ${(props) =>
    props.fonttype === "medium" &&
    css`
      font-size: 3rem;
    `}

  ${(props) =>
    props.semi_transparent==='1' &&
    css`
      opacity: 0.7;
    `}
`;

ColoredText.propTypes = {
  emphazised: PropTypes.string,
  text_attr_kinds: PropTypes.string,  
  fonttype: PropTypes.string,
  font_name: PropTypes.string,
};

export default ColoredText;
