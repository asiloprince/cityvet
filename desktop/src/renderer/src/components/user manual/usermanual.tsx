// src/components/user-manual/UserManual.tsx
import React from 'react'
import pdfFile from '../../assets/ldms-user-manual.pdf'

const UserManual: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <object data={pdfFile} type="application/pdf" width="99%" height="90%">
        <p>
          Your browser does not support PDFs.
          <a href={pdfFile} download>
            Download the PDF
          </a>
          instead.
        </p>
      </object>
    </div>
  )
}

export default UserManual
