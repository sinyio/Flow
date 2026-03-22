export interface INotFoundViewProps {
  title: string
  description?: string
}

const NotFoundView = ({ title, description }: INotFoundViewProps) => (
  <div style={{ padding: '24px 16px' }}>
    <h1 style={{ fontSize: '1.25rem', margin: '0 0 8px' }}>{title}</h1>
    {description ? <p style={{ margin: 0, opacity: 0.7 }}>{description}</p> : null}
  </div>
)

export default NotFoundView
