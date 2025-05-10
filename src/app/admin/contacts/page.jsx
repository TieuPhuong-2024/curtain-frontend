'use client';

import { useState, useEffect } from 'react';
import { getAllContacts, updateContactStatus, deleteContact } from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaEnvelope, FaPhone, FaSpinner, FaTrash } from 'react-icons/fa';

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContacts, setSelectedContacts] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await getAllContacts();
            setContacts(data);
            setSelectedContacts([]);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách liên hệ');
            toast.error('Không thể tải danh sách liên hệ');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateContactStatus(id, newStatus);
            setContacts(contacts.map(contact => 
                contact._id === id ? { ...contact, status: newStatus } : contact
            ));
            toast.success('Cập nhật trạng thái thành công');
        } catch (err) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleCheckboxChange = (contactId) => {
        setSelectedContacts(prev => {
            if (prev.includes(contactId)) {
                return prev.filter(id => id !== contactId);
            } else {
                return [...prev, contactId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedContacts(contacts.map(contact => contact._id));
        } else {
            setSelectedContacts([]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedContacts.length === 0) {
            toast.error('Vui lòng chọn ít nhất một liên hệ để xóa');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedContacts.length} liên hệ đã chọn?`)) {
            return;
        }
        
        try {
            // Delete contacts one by one
            for (const id of selectedContacts) {
                await deleteContact(id);
            }
            
            // Update local state
            setContacts(contacts.filter(contact => !selectedContacts.includes(contact._id)));
            setSelectedContacts([]);
            toast.success('Xóa liên hệ thành công');
        } catch (err) {
            toast.error('Không thể xóa liên hệ');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'new':
                return 'Mới';
            case 'processing':
                return 'Đang xử lý';
            case 'completed':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button
                        onClick={fetchContacts}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Liên hệ</h1>
                {selectedContacts.length > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        <FaTrash className="mr-2" /> Xóa ({selectedContacts.length})
                    </button>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người liên hệ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thông tin liên hệ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nội dung
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời gian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contacts.map((contact) => (
                                <tr key={contact._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedContacts.includes(contact._id)}
                                            onChange={() => handleCheckboxChange(contact._id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {contact.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaEnvelope className="w-4 h-4 mr-2" />
                                                {contact.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaPhone className="w-4 h-4 mr-2" />
                                                {contact.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {contact.subject && (
                                                <div className="font-medium mb-1">{contact.subject}</div>
                                            )}
                                            <div className="text-gray-500">{contact.message}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {format(new Date(contact.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                                            {getStatusText(contact.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={contact.status}
                                            onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                                            className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="new">Mới</option>
                                            <option value="processing">Đang xử lý</option>
                                            <option value="completed">Hoàn thành</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}