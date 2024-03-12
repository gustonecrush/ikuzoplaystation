import crypto from 'crypto';
import axios from 'axios';
import { NextResponse } from 'next/server'

async function updateDataStatus(order_id, transaction_status) {
    const payload = {
        status_reserve: transaction_status
    };

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/reservations/${order_id}`, payload);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response.data);
    }
}

export async function POST(request) {
    try {
        const serverKey = process.env.NEXT_PUBLIC_SECRET;
        
        // Retrieve POST request body data correctly
        const { order_id, status_code, gross_amount, signature_key, transaction_status } = await request.json();
        
        // Hash the concatenated string
        const hashed = crypto.createHash('sha512').update(order_id + status_code + gross_amount + serverKey).digest('hex');

        // Verify the signature
        if (hashed === signature_key) {
            // Handle transaction status

            updateDataStatus(order_id, transaction_status)
            
            if (transaction_status === 'capture') {
                // Payment successful, update order status or perform any required action
                // For example, you can call a function to update the order status in your database
                // updateOrderStatus(order_id, 'Paid');

                // Respond with a success message
                return NextResponse.json({ status: transaction_status,message: 'Payment successful. Order status updated.' })
            } else {
                // Transaction status is not 'capture', handle appropriately
                return NextResponse.json({ status: transaction_status, error: 'Transaction status is not capture.' })
            }
        } else {
            // Invalid signature, respond with an error
            return NextResponse.json({ status: transaction_status,error: 'Invalid signature key.' })
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error processing callback:', error);
        return NextResponse.json({ status: transaction_status,error: 'Internal server error.' })
    }
}
