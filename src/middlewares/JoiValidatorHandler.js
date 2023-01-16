export default (schema) => (request, response, next) => {
  const validationResult = schema.validate(request.body, { abortEarly: false });

  const { error } = validationResult;
  const isRequestInvalid = error != null;

  if (isRequestInvalid) {
    const { details } = error;
    const message = details.map((item) => (item.message));

    response.status(403).send({
      message,
      details
    });
  } else {
    next();
  }
};
