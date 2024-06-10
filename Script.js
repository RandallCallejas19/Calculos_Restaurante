const productos = [
    "TOÑA VIDRIO", "CLÁSICA", "CLÁSICA SELECCIÓN MAESTRO", "FROST", "SMIRNOFF MANZANA",
    "SOL", "BLISS", "HEINEKEN", "SMIRNOFF ORIGINAL", "SELTZER", "ADAN Y EVA", "BAMBOOO",
    "BAMBOO 9.5", "FUSION", "MILLER LITE", "TOÑA LIGHT", "TOÑA LATA"
];

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#cervezaTable tbody');
    const modal = document.getElementById("modal");
    const modalForm = document.getElementById("modalForm");
    const span = document.getElementsByClassName("close")[0];
    const totalEfectivoSpan = document.getElementById("totalEfectivo");

    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto}</td>
            <td><button class="edit-consignado">Editar</button></td>
            <td><button class="edit-precio">Editar</button></td>
            <td><input type="number" class="bodega" value="0"></td>
            <td><input type="number" class="barra" value="0"></td>
            <td><input type="number" class="actual" value="0" readonly></td>
            <td class="vendido">0</td>
            <td class="en-cajas">0</td>
            <td class="efectivo">C$0</td>
            <td class="sobrantes">0</td>
        `;
        tableBody.appendChild(row);
    });

    const consignados = JSON.parse(localStorage.getItem('consignados')) || {};
    const precios = JSON.parse(localStorage.getItem('precios')) || {};

    updateTable();

    function updateTable() {
        let totalEfectivo = 0;

        document.querySelectorAll('#cervezaTable tbody tr').forEach(row => {
            const producto = row.cells[0].textContent;
            const bodegaInput = row.querySelector('.bodega');
            const barraInput = row.querySelector('.barra');
            const actualInput = row.querySelector('.actual');
            const consignado = consignados[producto] || 0;
            const precio = precios[producto] || 0;

            const bodega = parseInt(bodegaInput.value) || 0;
            const barra = parseInt(barraInput.value) || 0;
            const actual = bodega + barra;
            actualInput.value = actual;

            const vendido = consignado - actual;
            const enCajas = Math.floor(vendido / 24);
            const efectivo = enCajas * precio;
            const sobrantes = Math.round((vendido / 24 - enCajas) * 24);

            row.querySelector('.vendido').textContent = vendido;
            row.querySelector('.en-cajas').textContent = enCajas;
            row.querySelector('.efectivo').textContent = `C$${efectivo}`;
            row.querySelector('.sobrantes').textContent = sobrantes;

            totalEfectivo += efectivo;
        });

        totalEfectivoSpan.textContent = `C$${totalEfectivo}`;
    }

    document.querySelectorAll('.edit-consignado').forEach(button => {
        button.addEventListener('click', (e) => {
            const producto = e.target.parentNode.parentNode.cells[0].textContent;
            openModal(producto, 'consignado');
        });
    });

    document.querySelectorAll('.edit-precio').forEach(button => {
        button.addEventListener('click', (e) => {
            const producto = e.target.parentNode.parentNode.cells[0].textContent;
            openModal(producto, 'precio');
        });
    });

    document.querySelectorAll('.bodega, .barra').forEach(input => {
        input.addEventListener('input', updateTable);
    });

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const producto = modalForm.dataset.producto;
        const type = modalForm.dataset.type;
        const value = parseInt(document.getElementById(type).value);

        if (type === 'consignado') {
            consignados[producto] = value;
            localStorage.setItem('consignados', JSON.stringify(consignados));
        } else {
            precios[producto] = value;
            localStorage.setItem('precios', JSON.stringify(precios));
        }

        modal.style.display = "none";
        updateTable();
    });

    span.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    function openModal(producto, type) {
        modalForm.dataset.producto = producto;
        modalForm.dataset.type = type;
        document.getElementById(type).value = type === 'consignado' ? consignados[producto] || 0 : precios[producto] || 0;
        modal.style.display = "block";
    }
});
