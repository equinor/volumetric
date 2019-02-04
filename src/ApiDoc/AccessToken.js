import React from 'react';
import styled from "styled-components";
import {Button} from "../import/common/Input";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {CodeBox} from "./common";

const TokenWrapper = styled.div`
  border: 3px solid #343434;
  border-radius: 3px;
  background-color: #E6E6E6;
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 80%;
  margin-top: 10px;
  padding-bottom: 10px;
`;

const TokenCodeBox = styled(CodeBox)`
  width: -webkit-fill-available;
  margin: 10px 10px 10px 10px;
`;

export const AccessToken = (props) => {
  const { showToken, token, handleChange, expireDate } = props;
  return (
    <div>
      {showToken ? (
        <div>
          <Button onClick={() => handleChange('showToken', false)}>Hide Access Token</Button>
          <TokenWrapper>
            <TokenCodeBox>{token}</TokenCodeBox>
            <CopyToClipboard text={token}>
              <Button>Copy to clipboard</Button>
            </CopyToClipboard>
            <p>
              <b>This Access Token will expire on: </b>{expireDate.toString()}
            </p>
          </TokenWrapper>
        </div>
      ) : (
        <Button onClick={() => handleChange('showToken', true)}>Show Access Token</Button>
      )}
    </div>
  )
};

export default AccessToken;