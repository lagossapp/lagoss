export default defineEventHandler(async event => {
  const user = await getUser(event);
  return { user: user ?? null };
});
