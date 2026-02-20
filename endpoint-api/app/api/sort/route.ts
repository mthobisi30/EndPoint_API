import { NextResponse } from 'next/server';

export async function POST(request: { json: () => any; }) {
  try {

    const body = await request.json();
    const { data } = body;

    if (typeof data !== 'string') {
      return NextResponse.json({ error: 'Invalid input. Expected a string.' }, { status: 400 });
    }

    const sortedArray = data.split('').sort();

    return NextResponse.json({ word: sortedArray });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }
}