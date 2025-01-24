export const env = (name: string) => {
  const variable = process.env[name];
  if (!variable) {
    throw new Error(`env variable missed: ${name}`);
  }
  return variable;
};
