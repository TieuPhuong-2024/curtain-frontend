'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AccountPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user document from Firestore with error handling
        const userDocRef = doc(db, 'users', user.uid);
        
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // If document doesn't exist, create it with basic info
            const basicUserData = {
              email: user.email,
              displayName: user.displayName || 'User',
              role: 'user',
              createdAt: new Date().toISOString()
            };
            
            setUserData(basicUserData);
            
            // Note: We're not setting the document here to avoid potential permission issues
            // This would typically be handled in the auth context when the user signs in
          }
        } catch (firestoreError) {
          console.error('Firestore Error:', firestoreError);
          
          // If there's a permission error, still show basic user info
          if (firestoreError.code === 'permission-denied') {
            setUserData({
              email: user.email,
              displayName: user.displayName || 'User',
              createdAt: 'Không có thông tin',
              role: 'user'
            });
            
            setError('Lưu ý: Dữ liệu hiển thị là thông tin cơ bản do quyền truy cập cơ sở dữ liệu bị hạn chế.');
          } else {
            throw firestoreError; // Re-throw other errors
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Lỗi khi tải dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
      
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <>
          <div className="bg-yellow-100 p-4 rounded-md mb-4">
            <p className="text-yellow-700">{error}</p>
          </div>
          {userData && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Thông tin cá nhân (Cơ bản)</h2>
                <p className="mt-2"><strong>Tên:</strong> {userData.displayName || user.displayName}</p>
                <p><strong>Email:</strong> {userData.email || user.email}</p>
              </div>
            </div>
          )}
        </>
      ) : userData ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            <p className="mt-2"><strong>Tên:</strong> {userData.displayName || user.displayName}</p>
            <p><strong>Email:</strong> {userData.email || user.email}</p>
            <p><strong>Vai trò:</strong> {userData.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
            <p><strong>Ngày tạo tài khoản:</strong> {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'Không có thông tin'}</p>
          </div>
        </div>
      ) : (
        <p>Không có dữ liệu người dùng</p>
      )}
    </div>
  );
} 