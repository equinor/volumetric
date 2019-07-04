import styled from 'styled-components';

export const CodeBox = styled.pre`
  font-size: 13px;
  border: 1px solid #cacaca;
  line-height: 1.4em;
  padding: 10px;
  overflow: auto;
  border-radius: 3px;
  background-color: #fafafb;
  color: #393939;
  margin-top: 0;
  font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  white-space: pre-wrap;
  width: fit-content;
`;

export const DocH2 = styled.h2`
  color: #3c4146;
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 0;
`;

export const InlineCode = styled.b`
  border: 1px solid #cacaca;
  border-radius: 3px;
  background-color: #fafafb;
  color: #393939;
  margin-top: 0;
  font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  display: inline;
  font-weight: 100;
`;
