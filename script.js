jQuery(document).ready(function ($) {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTBx2QFmcm79K2dkyShsmZEV490KKtEMIYIrzG7HrxAw1Z5AxPFHzvoFhKNdOigjRnb7VAbrSpUPtII/pub?output=csv';

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function (results) {
      let data = results.data;

      // Clean and prepare data
      data = data.map(row => {
        // Clean Subject
        row["Subject"] = (row["Subject"] || "").replace(/_/g, " ").replace(/\.pdf$/i, "").trim();

        // Parse and attach sortable date
        const dateParts = (row["Date"] || "").split("-");
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          row["SortDate"] = `${year}-${month}-${day}`;
        } else {
          row["SortDate"] = null; // Mark invalid or missing dates
        }

        return row;
      });

      // Sort: valid dates first (descending), invalid dates at the end
      data.sort((a, b) => {
        if (!a.SortDate && !b.SortDate) return 0;
        if (!a.SortDate) return 1;
        if (!b.SortDate) return -1;
        return new Date(b.SortDate) - new Date(a.SortDate);
      });

      // Append table rows
      const tbody = $('#csvTable tbody');
      tbody.empty();

      data.forEach(function (row, index) {
        const serialNumber = index + 1; // Sequential S.N.
        const tableRow = `
          <tr>
            <td data-label="S.N.">${serialNumber}</td>
            <td data-label="Letter No.">${row["Letter No."] || ""}</td>
            <td data-label="Date">${row["Date"] || ""}</td>
            <td data-label="Subject" class="wrap-text">${row["Subject"]}</td>
            <td data-label="Download">${row["Button"] || ""}</td>
          </tr>`;
        tbody.append(tableRow);
      });

      // DataTable Init
      $('#csvTable').DataTable({
        responsive: true,
        pageLength: 5,
        autoWidth: false,
        order: [], // Manual sorting already applied
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
        initComplete: function () {
          $('.dataTables_wrapper').css('padding-bottom', '20px');
          $('#csvTable thead th').css({
            'background-color': '#e615ed',
            'color': '#ffffff'
          });
        },
        drawCallback: function () {
          $('#csvTable thead th').css({
            'background-color': '#e615ed',
            'color': '#ffffff'
          });
        }
      });
    },
    error: function (err) {
      console.error('CSV Load Error:', err);
      alert('Failed to load data. Please try again later.');
    }
  });

  window.addEventListener("load", function () {
    document.body.style.overflow = "auto";
    const main = document.querySelector("main");
    if (main) {
      main.style.height = "auto";
    }
  });
});
