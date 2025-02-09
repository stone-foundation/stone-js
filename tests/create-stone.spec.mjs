import spawn from 'cross-spawn';
import { argv } from 'node:process';

// Mock the dependencies
vi.mock('cross-spawn', () => {
  const spawnMock = vi.fn(() => ({
    exit: vi.fn(),
    on: vi.fn((event, callback) => {
      if (event === 'close') {
        callback(0); // Simulate a successful exit code
      }
    }),
  }));

  return {
    default: spawnMock,
  };
});

vi.mock('node:process', async () => {
  const actual = await vi.importActual('node:process');
  return {
    ...actual,
    argv: ['node', 'create-stone.mjs'], // Mock default arguments
  };
});

describe('stone-init script', () => {
  it('should invoke `stone init` with additional arguments', async () => {
    vi.mocked(argv).push('stone-app', '--yes');

    // Import the script
    await import('../bin/create-stone.mjs');

    expect(spawn).toHaveBeenCalledWith('stone', ['init', 'stone-app', '--yes'], { stdio: 'inherit' });
  });
});
