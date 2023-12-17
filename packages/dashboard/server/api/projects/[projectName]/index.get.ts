export default defineEventHandler(async event => {
  return await requireProject(event);
});
