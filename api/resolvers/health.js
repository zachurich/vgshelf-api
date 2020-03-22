const Health = (req, res) => {
  return res.send({
    msg: "UP!",
    code: res.statusCode
  });
};

export default Health;
