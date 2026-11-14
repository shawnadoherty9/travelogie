import { describe, it, expect } from 'vitest';
import { validateVideoFile, validateVideoDuration } from './videoValidation';

describe('video rules', () => {
  it('accepts MP4, MOV and WebM', () => {
    for (const type of ['video/mp4', 'video/quicktime', 'video/webm']) expect(validateVideoFile({ type, size: 1000 })).toBeNull();
  });
  it('rejects other file types', () => {
    expect(validateVideoFile({ type: 'image/png', size: 1000 })).toMatch(/MP4/);
  });
  it('rejects files over 50 MB', () => {
    expect(validateVideoFile({ type: 'video/mp4', size: 50 * 1024 * 1024 + 1 })).toMatch(/50 MB/);
    expect(validateVideoFile({ type: 'video/mp4', size: 50 * 1024 * 1024 })).toBeNull();
  });
  it('rejects videos longer than 2 minutes', () => {
    expect(validateVideoDuration(120)).toBeNull();
    expect(validateVideoDuration(150)).toMatch(/2 minutes/);
  });
});
