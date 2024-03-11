import createReport from 'docx-templates';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler for POST requests to generate a Word document report.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing the generated report.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse form data from the request
    const formData = await request.formData();

    // Get the file and values from the form data
    const file = formData.get('file') as File;
    const values = formData.get('values') as string;

    // Read the template file into a buffer
    const template = await file.arrayBuffer();

    // Create a report from the template and data
    const buffer = await createReport({
      template: Buffer.from(template), // Convert template to buffer
      data: JSON.parse(values),
      cmdDelimiter: ['{', '}'], // Set custom command delimiters
    });

    // Set response headers
    const headers = new Headers();
    headers.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    // Return the response with the generated report
    return new NextResponse(buffer, { status: 200, statusText: 'OK', headers });
  } catch (error: any) {
    // If an error occurs, return an error response
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
