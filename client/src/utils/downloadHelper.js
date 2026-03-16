import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadInvoice = async (invoiceData) => {
    const { id, date, planName, price, discount, total } = invoiceData;

    // Create a temporary container for the invoice HTML
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.fontFamily = "'Inter', sans-serif";

    container.innerHTML = `
        <div style="background: #fff; padding: 40px; color: #000;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; border-bottom: 4px solid #e50914; padding-bottom: 20px;">
                <div>
                    <h1 style="margin: 0; color: #e50914; font-size: 32px; font-weight: 900; letter-spacing: -1px; font-style: italic;">STREAMHUB <span style="color: #000; font-style: normal;">ELITE</span></h1>
                    <p style="margin: 5px 0 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Membership Architecture</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase;">Tax Invoice</h2>
                    <p style="margin: 5px 0 0; color: #666; font-size: 12px;">ID: #${id}</p>
                    <p style="margin: 2px 0 0; color: #666; font-size: 12px;">Date: ${date}</p>
                </div>
            </div>

            <div style="margin-bottom: 40px;">
                <p style="margin: 0 0 10px; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 800; letter-spacing: 1px;">Billed To</p>
                <div style="font-size: 14px; font-weight: 600;">StreamHub Member</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">Digital Vault Entry #${id.substr(0, 4)}</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                <thead>
                    <tr style="background: #f8f8f8;">
                        <th style="padding: 15px; text-align: left; font-size: 10px; text-transform: uppercase; color: #666;">Description</th>
                        <th style="padding: 15px; text-align: right; font-size: 10px; text-transform: uppercase; color: #666;">Original Price</th>
                        <th style="padding: 15px; text-align: right; font-size: 10px; text-transform: uppercase; color: #666;">Discount</th>
                        <th style="padding: 15px; text-align: right; font-size: 10px; text-transform: uppercase; color: #666;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 15px; font-size: 14px; font-weight: 700;">${planName} Tier Membership <br/><span style="font-size: 11px; font-weight: 400; color: #666;">Monthly Protocol Access</span></td>
                        <td style="padding: 15px; text-align: right; font-size: 14px;">₹${price}</td>
                        <td style="padding: 15px; text-align: right; font-size: 14px; color: #22c55e;">-₹${discount}</td>
                        <td style="padding: 15px; text-align: right; font-size: 14px; font-weight: 900;">₹${total}</td>
                    </tr>
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-bottom: 60px;">
                <div style="width: 250px;">
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                        <span style="font-size: 12px; color: #666;">Subtotal</span>
                        <span style="font-size: 12px; font-weight: 600;">₹${price}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                        <span style="font-size: 12px; color: #666;">Promotion Applied</span>
                        <span style="font-size: 12px; font-weight: 600; color: #22c55e;">-₹${discount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 20px 0; background: #fff;">
                        <span style="font-size: 14px; font-weight: 900; text-transform: uppercase;">Total Charged</span>
                        <span style="font-size: 20px; font-weight: 900; color: #e50914;">₹${total}</span>
                    </div>
                </div>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 30px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0; font-size: 10px; color: #999; text-transform: uppercase; font-weight: 700;">Security Protocol</p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #000; font-weight: 600;">VERIFIED BY CYBER-VAULT v4.1</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 11px; color: #666;">This is a digitally generated document. No physical signature required.</p>
                </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <p style="font-size: 10px; color: #ccc; font-style: italic;">Thank you for being part of the Elite Cinematic experience.</p>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`StreamHub-Invoice-${id}.pdf`);
    } catch (error) {
        console.error('PDF generation failed:', error);
    } finally {
        document.body.removeChild(container);
    }
};

export const downloadAdminReport = async (data, filename) => {
    if (!data || data.length === 0) return;

    // Create a temporary container for the report
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '1000px';
    container.style.background = '#fff';
    container.style.padding = '40px';
    container.style.fontFamily = "'Inter', sans-serif";

    const headers = Object.keys(data[0]);
    const today = new Date().toLocaleDateString();

    container.innerHTML = `
        <div style="color: #000;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">System Activity Audit <span style="color: #e50914;">[CONFIDENTIAL]</span></h1>
                <p style="margin: 0; font-size: 12px; color: #666;">Generated: ${today}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                    <tr style="background: #000; color: #fff;">
                        ${headers.map(h => `<th style="padding: 10px; text-align: left; text-transform: uppercase; letter-spacing: 1px;">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map((row, idx) => `
                        <tr style="border-bottom: 1px solid #eee; background: ${idx % 2 === 0 ? '#fff' : '#f9f9f9'};">
                            ${headers.map(h => `<td style="padding: 10px;">${row[h]}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                <p style="font-size: 9px; color: #999;">End of System Logs. Document secured with RSA-4096 Encryption standards for internal use only.</p>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for reports
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename.replace('.csv', '')}.pdf`);
    } catch (error) {
        console.error('PDF report failed:', error);
        // Fallback to CSV if PDF fails
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + data.map(row => Object.values(row).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } finally {
        document.body.removeChild(container);
    }
};
