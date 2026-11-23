import Tasks from "../src/models/Task";

const validTask = {
  title: "Write docs",
  description: "README and technical docs",
  userId: "user-1",
};

test("a task with all required fields is valid", () => {
  const task = new Tasks(validTask);
  expect(task.validateSync()).toBeFalsy();
});

test("title is required", () => {
  const task = new Tasks({ ...validTask, title: undefined });
  expect(task.validateSync()?.errors.title).toBeDefined();
});

test("description is required", () => {
  const task = new Tasks({ ...validTask, description: undefined });
  expect(task.validateSync()?.errors.description).toBeDefined();
});

test("userId is required", () => {
  const task = new Tasks({ ...validTask, userId: undefined });
  expect(task.validateSync()?.errors.userId).toBeDefined();
});

test("createdAt gets a default value", () => {
  const task = new Tasks(validTask);
  expect(task.createdAt).toBeDefined();
});
