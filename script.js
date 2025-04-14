jQuery(document).ready(function($) {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBx2QFmcm79K2dkyShsmZEV490KKtEMIYIrzG7HrxAw1Z5AxPFHzvoFhKNdOigjRnb7VAbrSpUPtII/pub?output=csv';

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      const tbody = $('#csvTable tbody');
      tbody.empty();

      data.forEach(function(row, index) {
        if (!row["S.N."]) return;

        const tableRow = `
          <tr>
            <td data-label="S.N.">${row["S.N."]}</td>
            <td data-label="Letter No.">${row["Letter No."]}</td>
            <td data-label="Date">${row["Date"]}</td>
            <td data-label="Subject" class="wrap-text">${row["Subject"]}</td>
            <td data-label="Download">${row["Button"]}</td>
          </tr>`;
        tbody.append(tableRow);
      });

      $('#csvTable').DataTable({
        responsive: true,
        pageLength: 5,
        autoWidth: false,
        dom: '<"top-wrapper"lf>rt<"bottom-wrapper"ip>',
        language: {
          searchPlaceholder: "Search records...",
          search: "",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          paginate: {
            previous: "‹",
            next: "›"
          }
        },
        initComplete: function() {
          $('.dataTables_wrapper').css('padding-bottom', '20px');
          $('#csvTable thead th').css({
            'background-color': '#e615ed',
            'color': '#ffffff'
          });
        },
        drawCallback: function() {
          $('#csvTable thead th').css({
            'background-color': '#e615ed',
            'color': '#ffffff'
          });
        }
      });
    },
    error: function(err) {
      console.error('CSV Load Error:', err);
      alert('Failed to load data. Please try again later.');
    }
  });
});
