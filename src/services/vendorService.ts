const VENDOR_API_URL = import.meta.env.VITE_VENDOR_API_URL || 'http://172.16.1.82:9001';

export const vendorService = {
    fetchVendorToken: async () => {
        try {
            const params = new URLSearchParams();
            params.append('username', 'admin');
            params.append('password', 'admin');
            params.append('grant_type', 'password');
            params.append('level5code', '100');
            params.append('yearcode', '1010');
            
            const response = await fetch(`${VENDOR_API_URL}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch vendor token');
            }
            const data = await response.json();
            if (data && data.access_token) {
                localStorage.setItem('vendor_admin_token', data.access_token);
            }
            return data;
        } catch (error) {
            console.error('Vendor fetch token error:', error);
            throw error;
        }
    },
    createUser: async (data: any) => {
        try {
            const token = localStorage.getItem('vendor_admin_token');
            const headers: any = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${VENDOR_API_URL}/api/accounts/CreateUser`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create vendor user');
            }
            // Some .NET APIs might return empty response on success
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Vendor CreateUser error:', error);
            throw error;
        }
    },
    createSchemeMember: async (data: any) => {
        try {
            const token = localStorage.getItem('vendor_admin_token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${VENDOR_API_URL}/nextapi/System/SEAPOSSchemeMember/SaveData`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create scheme member');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Vendor createSchemeMember error:', error);
            throw error;
        }
    },
    createSchemeRegistration: async (data: any) => {
        try {
            const token = localStorage.getItem('vendor_admin_token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${VENDOR_API_URL}/nextapi/System/SEAPOSSchemeRegistration/SAVEDATA`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create scheme registration');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Vendor createSchemeRegistration error:', error);
            throw error;
        }
    },
    createSchemeReceipt: async (data: any) => {
        try {
            const token = localStorage.getItem('vendor_admin_token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${VENDOR_API_URL}/nextapi/System/SEAGeneralLedgerSchemeReceipt/SaveData`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to create scheme receipt');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Vendor createSchemeReceipt error:', error);
            throw error;
        }
    },
    getSalesmen: async () => {
        try {
            const token = localStorage.getItem('vendor_admin_token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${VENDOR_API_URL}/nextapi/GETSalesManList`, {
                method: 'GET',
                headers,
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch salesmen');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : [];
        } catch (error) {
            console.error('Vendor getSalesmen error:', error);
            throw error;
        }
    },
    getOfflinePayments: async (schemeMemberCode: string) => {
        try {
            const token = localStorage.getItem('vendor_admin_token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`${VENDOR_API_URL}/nextapi/Get_Scheme_Member_Payment_Data?SchemeMemberCode=${encodeURIComponent(schemeMemberCode)}`, {
                method: 'GET',
                headers,
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch offline payments');
            }
            const text = await response.text();
            return text ? JSON.parse(text) : [];
        } catch (error) {
            console.error('Vendor getOfflinePayments error:', error);
            throw error;
        }
    },
};

export default vendorService;
