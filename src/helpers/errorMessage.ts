export const checkError = (
  fields: string[],
  messageField: string,
  errors: Record<string, any>,
): string | undefined => {
  const [arg1, arg2, arg3] = fields;
  const replaceTo = arg3 || arg2;

  if (!Object.entries(errors).length) {
    return undefined;
  }

  if (arg1 && arg2 && arg3) {
    const list = errors[arg1];
    
    if (list?.length) {
      const nestedList = list.find((item: Record<string, any>) => 
        item && item[arg2]
      );
      if (nestedList && nestedList[arg2] && nestedList[arg2].length) {
        const message = nestedList[arg2]
          .find((item: Record<string, string>) => 
            item && item[arg3] && item[arg3].includes(messageField)
          );
        return message && message[arg3]?.replace(messageField, replaceTo);
      }
    }

  } else if (arg1 && arg2) {
    const list = errors[arg1];

    if (list?.length) {
      const message = list.find(
        (item: Record<string, string>) => item && item[arg2] && item[arg2].includes(messageField)
      );

      return message && message[arg2]?.replace(messageField, replaceTo);
    }
  }
};