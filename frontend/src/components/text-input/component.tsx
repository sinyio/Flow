import { TextInput, TextInputProps } from '@gravity-ui/uikit'

const BaseTextInput = ({ ...rest }: TextInputProps) => <TextInput label="Email:" {...rest} />

export default BaseTextInput
