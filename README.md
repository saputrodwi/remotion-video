# remotion-video

Project Remotion (video programatik berbasis React) dengan auto-render via GitHub Actions.

## Struktur

```
src/
  index.ts                    # entry point (registerRoot)
  Root.tsx                    # daftar Composition
  compositions/
    HelloWorld.tsx            # contoh scene 1080p/30fps, 5 detik
public/
  (taruh file audio di sini, mis. music.mp3)
out/
  (hasil render lokal — tidak dipush ke repo)
.github/workflows/
  render.yml                  # auto render setiap push ke main
```

## Menjalankan lokal

```bash
npm install
npx remotion studio     # preview interaktif di browser
npm run render          # render ke out/hello-world.mp4
```

## Render via GitHub Actions

1. Push ke `main` — workflow `render.yml` otomatis jalan.
2. Buka tab **Actions** repo, download artifact `rendered-video` (MP4).
3. Bisa juga manual trigger via **Run workflow** di tab Actions.

## Menambah audio

```tsx
import {AbsoluteFill, Audio} from 'remotion';

<Audio src={'./public/music.mp3'} />
```

Atau pakai `@remotion/media-utils` (`createAudio`, `getAudioDuration`) untuk sync durasi.

## Menambah scene baru

1. Buat file di `src/compositions/MyScene.tsx`.
2. Daftarkan di `src/Root.tsx`:
   ```tsx
   <Composition id="MyScene" component={MyScene} durationInFrames={150} fps={30} width={1920} height={1080} />
   ```
3. Update `command:` di `.github/workflows/render.yml` (atau buat workflow per scene / pakai `--props` untuk banyak varian).

## Catatan CI

- Runner GitHub: 4 vCPU / ~16 GB RAM, **CPU-only** (tanpa GPU).
- `--concurrency=3` di workflow dipilih sebagai keseimbangan aman; naikkan bila RAM masih longgar.
- Artifact tersimpan 30 hari (bisa di-set via `retention-days`).
