import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
`;

export const InputRepo = styled.input.attrs({
  type: 'text',
  placeholder: 'Adicionar repositório',
})`
  flex: 1;
  border: 1px solid ${props => (props.failure ? '#dc3545' : '#eee')};
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #333;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-weight: bold;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #ffa939;
      font-weight: bold;
      text-decoration: none;
    }
  }
`;
