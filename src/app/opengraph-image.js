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
          background: 'linear-gradient(to bottom, #f8ad61, #d57636)',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          src="http://localhost:3000/images/logo.png"
          alt="Tuấn Rèm Logo"
          width={200}
          height={200}
          style={{ marginBottom: 40 }}
        />
        <div style={{ fontWeight: 'bold' }}>Tuấn Rèm</div>
        <div style={{ fontSize: 30, marginTop: 20 }}>
          Rèm Cửa Cao Cấp Cho Không Gian Của Bạn
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
