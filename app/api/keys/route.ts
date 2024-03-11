import { listCommands } from 'docx-templates';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler for POST requests to list placeholders in a Word document template.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing the list of placeholders.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse form data from the request
    const formData = await request.formData();

    // Get the file from the form data
    const file: File = formData.get('file') as File;

    // Read the template file into a buffer
    const template = await file.arrayBuffer();

    // Retrieve commands from the template
    const commands = await listCommands(template, ['{', '}']);

    // Set response headers
    const headers = new Headers();
    headers.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    // Return the response with the list of commands
    return NextResponse.json({
      keys: commands,
    });
  } catch (error: any) {
    // If an error occurs, return an error response
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
