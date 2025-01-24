export const slugGen = (text: string) => {
  return text.split(" ").join("-");
};
