'use client'

import { useEffect, useState } from 'react';
import { favoriteService } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import CurtainCard from '@/components/CurtainCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchFavorites();
    }
  }, [user, authLoading, router]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await favoriteService.getFavorites();
      if (response.success && Array.isArray(response.data)) {
        setFavorites(response.data);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="mb-4">Bạn cần đăng nhập để xem sản phẩm yêu thích</p>
          <button 
            onClick={() => router.push('/login')} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải danh sách yêu thích...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>
      {favorites.length === 0 ? (
        <div className="text-center py-8">
          <p>Bạn chưa có sản phẩm yêu thích nào.</p>
          <button 
            onClick={() => router.push('/products')} 
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Xem sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(product => (
            <CurtainCard key={product._id} curtain={product} />
          ))}
        </div>
      )}
    </div>
  );
}
