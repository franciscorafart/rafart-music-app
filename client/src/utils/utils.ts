export const dateToLocalDateTime = (d: string, local?: string) => {
  const newDate = new Date(d);
  const loc = local || "es-CL";
  return `${newDate.toLocaleDateString(loc)} - ${newDate.toLocaleTimeString(
    loc
  )}`;
};

export const dateToLocalDate = (d: string, local?: string) => {
  const newDate = new Date(d);
  const loc = local || "es-CL";
  return `${newDate.toLocaleDateString(loc)}`;
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatLongString(input: string): string {
  if (input.length <= 12) {
    return input;
  } else {
    return `${input.slice(0, 6)}..${input.slice(-4)}`;
  }
}
