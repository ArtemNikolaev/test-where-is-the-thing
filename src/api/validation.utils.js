function validateEntity({name, value}) {
  if (!name || isNaN(value)) {
    throw 'Thing Validation broke everything';
  }

  return true;
}
