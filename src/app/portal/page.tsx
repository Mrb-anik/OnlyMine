import { useState } from 'react';
import { Upload } from 'lucide-react';

const LeadsTab = ({ onRefresh }) => {
    const [csvFile, setCsvFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [error, setError] = useState(false);

    const handleFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!csvFile) {
            setError(true);
            setUploadMessage('Please select a CSV file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('file', csvFile);
        try {
            // Replace with your actual upload endpoint
            const response = await fetch('/api/upload-csv', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setUploadMessage('CSV uploaded successfully!');
                onRefresh();
                setError(false);
            } else {
                throw new Error('Upload failed.');
            }
        } catch (error) {
            setError(true);
            setUploadMessage('Error uploading CSV: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Leads Tab</h2>
            {/* Existing lead filtering and table display code would go here */}
            <form onSubmit={handleUpload} style={{ marginTop: '20px' }}>
                <label>
                    <Upload /> Upload CSV:
                    <input type="file" accept=".csv" onChange={handleFileChange} style={{ marginLeft: '8px' }} />
                </label>
                <button type="submit" style={{ marginLeft: '8px' }}>Submit</button>
            </form>
            {uploadMessage && (
                <p style={{ color: error ? 'red' : 'green' }}>{uploadMessage}</p>
            )}
        </div>
    );
};

export default LeadsTab;