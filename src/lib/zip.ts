export interface ZipEntry {
  name: string;
  content: string;
}

export async function readZip(arrayBuffer: ArrayBuffer): Promise<ZipEntry[]> {
  const bytes = new Uint8Array(arrayBuffer);
  const files: ZipEntry[] = [];

  let i = 0;
  while (i < bytes.length - 4) {
    // Local file header signature: PK\x03\x04
    if (
      bytes[i]   === 0x50 && bytes[i+1] === 0x4b &&
      bytes[i+2] === 0x03 && bytes[i+3] === 0x04
    ) {
      const compression = bytes[i+8]  | (bytes[i+9]  << 8);
      const compSize    = bytes[i+18] | (bytes[i+19] << 8) | (bytes[i+20] << 16) | (bytes[i+21] << 24);
      const uncompSize  = bytes[i+22] | (bytes[i+23] << 8) | (bytes[i+24] << 16) | (bytes[i+25] << 24);
      const nameLen     = bytes[i+26] | (bytes[i+27] << 8);
      const extraLen    = bytes[i+28] | (bytes[i+29] << 8);
      const nameBytes   = bytes.slice(i + 30, i + 30 + nameLen);
      const name        = new TextDecoder().decode(nameBytes);
      const dataStart   = i + 30 + nameLen + extraLen;

      if (name.toLowerCase().endsWith('.xml') && !name.startsWith('__MACOSX')) {
        if (compression === 0) {
          // Stored — no compression
          const xmlBytes = bytes.slice(dataStart, dataStart + uncompSize);
          files.push({ name, content: new TextDecoder().decode(xmlBytes) });
        } else if (compression === 8) {
          // Deflate
          const compData = bytes.slice(dataStart, dataStart + compSize);
          try {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            const reader = ds.readable.getReader();
            writer.write(compData);
            writer.close();

            const chunks: Uint8Array[] = [];
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
            }

            const total  = chunks.reduce((n, c) => n + c.length, 0);
            const merged = new Uint8Array(total);
            let off = 0;
            for (const c of chunks) { merged.set(c, off); off += c.length; }

            files.push({ name, content: new TextDecoder().decode(merged) });
          } catch (e) {
            console.warn('Could not decompress', name, e);
          }
        }
      }

      i = dataStart + compSize;
    } else {
      i++;
    }
  }

  return files;
}
