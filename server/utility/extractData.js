export const extractData =(req) => new Promise((resolve, reject) => {
       let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
        const parsed = JSON.parse(data);
        resolve(parsed);
    });
    req.on('error', err => {
      reject(err);
    });
  });
  
