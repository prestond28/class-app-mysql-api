export default async function query(con, query, params) {
  return new Promise((resolve, reject) => {
    con.query(query, params, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}