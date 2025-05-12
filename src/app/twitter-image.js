import { ImageResponse } from 'next/og';

export const alt = 'Tuấn Rèm - Rèm Cửa Cao Cấp';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(to bottom, #5a3e2b, #8b6c55)',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '40px',
        }}
      >
        <img
          src="http://localhost:3000/images/logo.png"
          alt="Tuấn Rèm Logo"
          width={180}
          height={180}
          style={{ marginBottom: 30 }}
        />
        <div style={{ fontWeight: 'bold', marginBottom: 20 }}>Tuấn Rèm</div>
        <div style={{ fontSize: 28, lineHeight: 1.4 }}>
          Đa dạng mẫu mã rèm cửa cao cấp cho nhà ở và văn phòng
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
