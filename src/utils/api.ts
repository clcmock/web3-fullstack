
export const getOracleList = async () => {
  return fetch('//127.0.0.1:3001/')
    .then(res => res.json());
}