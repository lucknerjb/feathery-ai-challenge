export const EXTRACTION_MESSAGE = (schema: string) => `
Your task is to analyze a document and extract the required information accurately and efficiently.

First, carefully study the JSON schema that defines the structure and requirements for the data you need to extract:

<json_schema>
${schema}
</json_schema>

Your task is to extract the unique values for the fields described in the JSON schema from the provided document. Follow these instructions carefully:

1. Analyze each page of the document sequentially.
2. For each field in the JSON schema,
  a. Search for the corresponding value using the field's name, description and properties.
  b. Extract the data character by character, unless otherwise specified.
  c. Adhere to the rules defined in the JSON schema for each field.
3. Ensure uniqueness of data across all pages, not just within individual pages.
4. If a field is not present in the document, leave it blank and do not include it in your response.

Your final response should be a JSON object containing the extracted values for the fields that exist in the document.

Example response structure: 

{
  "results": {
    "field_name_1": "field_name_1_value",
    "field_name_2": "field_name_2_value",
    "object_field_array": [
      {
        "obj_field_1": "obj_field_1_value",
        "obj_field_2": "obj_field_2_value",
        "obj_field_3": "obj_field_3_value"
      },
      {
        "obj_field_1": "obj_field_1_value_2",
        "obj_field_2": "obj_field_2_value_2",
        "obj_field_3": "obj_field_3_value_2"
      }
    ],
  }
}

Remember to adhere to all rules and requirements specified in the JSON schema and these instructions. Proceed with your analysis and extraction of the data.
`;
