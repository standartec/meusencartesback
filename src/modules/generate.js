const inserts = [
    {
    
      header_image: '303_header.png',
      footer_image: '303_footer.png',
      complete_image: '303_complete.png',
      middle_image: '303_middle.png',
      background_image: '303_middle.png',
      logo: '',
      footer_text: '',
      header_left_text: '',
      badge_image: '',
      id_user: 1,
      header_text_right: '',
      footer_text2: '',
      template_type: 1,
      has_logo: 0,
      has_left_text: 0,
      has_right_text: 0,
      has_footer_text: 0,
      main_color: '#020001',
      status: 1,
      font_color: '#FFFFFF',
      id_model: '',
      id_model_type: '',
      order_template: 1,
      type_template: 1,
      font_color_product: '#FFFFFF',
      product_color_with_background: '',
      font_color_bottom: '#FFFFFF',
      color_form_bottom: '',
      color_form_font_bottom: '',
      template_detail: '',
      template_name: 'indexLogoGrande.ejs'
    },
    {
    
      header_image: '304_header.png',
      footer_image: '304_footer.png',
      complete_image: '304_complete.png',
      middle_image: '304_middle.png',
      background_image: '304_middle.png',
      logo: '',
      footer_text: '',
      header_left_text: '',
      badge_image: '',
      id_user: 1,
      header_text_right: '',
      footer_text2: '',
      template_type: 1,
      has_logo: 0,
      has_left_text: 0,
      has_right_text: 0,
      has_footer_text: 0,
      main_color: '#020001',
      status: 1,
      font_color: '#FFFFFF',
      id_model: '',
      id_model_type: '',
      order_template: 1,
      type_template: 1,
      font_color_product: '#FFFFFF',
      product_color_with_background: '',
      font_color_bottom: '#FFFFFF',
      color_form_bottom: '',
      color_form_font_bottom: '',
      template_detail: '',
      template_name: 'indexLogoGrande.ejs'
    },
    {
 
      header_image: '305_header.png',
      footer_image: '305_footer.png',
      complete_image: '305_complete.png',
      middle_image: '305_middle.png',
      background_image: '305_middle.png',
      logo: '',
      footer_text: '',
      header_left_text: '',
      badge_image: '',
      id_user: 1,
      header_text_right: '',
      footer_text2: '',
      template_type: 1,
      has_logo: 0,
      has_left_text: 0,
      has_right_text: 0,
      has_footer_text: 0,
      main_color: '#020001',
      status: 1,
      font_color: '#FFFFFF',
      id_model: '',
      id_model_type: '',
      order_template: 1,
      type_template: 1,
      font_color_product: '#FFFFFF',
      product_color_with_background: '',
      font_color_bottom: '#FFFFFF',
      color_form_bottom: '',
      color_form_font_bottom: '',
      template_detail: '',
      template_name: 'indexLogoGrande.ejs'
    }
  ];

  class SQLInsertBuilder {
    constructor(tableName, fields) {
      this.tableName = tableName;
      this.fields = fields;
    }
  
    createInsertSQL(dataObject) {
      let columns = [];
      let placeholders = [];
      let values = [];
  
      this.fields.forEach(field => {
        if (dataObject.hasOwnProperty(field)) {
          columns.push(field);
          values.push(this.escapeValue(dataObject[field]));
          placeholders.push('?');
        }
      });
  
      // Substitui placeholders por valores para construir a instrução final
      let sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')});`;
      for (let i = 0; i < values.length; i++) {
        sql = sql.replace('?', values[i]);
      }
  
      return sql;
    }
  
    // Escapar valor para SQL
    escapeValue(value) {
      if (value === null || value === undefined || value === '') {
        return 'NULL';
      } else if (typeof value === 'string') {
        // Sua condição específica para 'dark'
        if (value.toLowerCase() === 'dark') {
          return "'#000000'"; // Cor preta em vez de branca para font_color
        }
        // Escapa aspas simples para strings
        return `'${value.replace(/'/g, "''")}'`; 
      } else if (typeof value === 'number') {
        return value;
      }
      // Implemente mais condições conforme necessário para outros tipos de dados
    }
  }
  
  const tableName = 'onecart.template';
  const fields = [
    'main_color_type', 'collor_bottom', 'header_image', 'footer_image', 'complete_image',
    'middle_image', 'background_image', 'logo', 'footer_text', 'header_left_text',
    'badge_image', 'id_user', 'header_text_right', 'footer_text2', 'template_type',
    'has_logo', 'has_left_text', 'has_right_text', 'has_footer_text', 'main_color',
    'status', 'font_color', 'id_model', 'id_model_type', 'order_template', 'type_template',
    'font_color_product', 'product_color_with_background', 'font_color_bottom',
    'color_form_bottom', 'color_form_font_bottom', 'template_detail', 'template_name'
  ];
  
  const insertBuilder = new SQLInsertBuilder(tableName, fields);
  
  const inserts = [
    // ... sua lista de objetos aqui
  ];
  
  // Gera as instruções SQL para cada objeto
  inserts.forEach((obj, index) => {
    const sql = insertBuilder.createInsertSQL(obj);
    console.log(`SQL for insert ${index + 1}:\n`, sql, '\n');
  });