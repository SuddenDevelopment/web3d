import { ConfigProvider } from 'antd';
import './global.css'
export const metadata = {
  title: 'Web3D',
  description: 'by Anthony Aragues',
}
/* https://ant.design/docs/react/customize-theme */
export default function RootLayout({ children }) {
 return (
    <ConfigProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ConfigProvider>
  );
}
