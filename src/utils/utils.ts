export const getTime = function()
{
  /*
  * Needed to use .padStart, because .getX functions return the
  * time without leading zeros, e.g.: 14:47:8, which looks horrendous.
  */
  const d = new Date();
  const h = `${d.getHours()}`.padStart(2, "0");
  const m = `${d.getMinutes()}`.padStart(2, "0");
  const s = `${d.getSeconds()}`.padStart(2, "0");
  return h + ":" + m + ":" + s;
};

export const getDate = function()
{
  const d = new Date();
  const y = d.getUTCFullYear();
  // Function 'getUTCMonth' returns an integer number, between 0 and 11.
  // Therefore need to add + 1.
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return `${day}-${m}-${y}`;
};


